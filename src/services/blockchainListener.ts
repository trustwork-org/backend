import { ethers } from 'ethers';
import { env } from '../config/env';
import { User } from '../models/User';
import { sendNotificationEmail } from './emailService';

// ABIs — events the listener subscribes to plus the read fn used to look up
// the client/freelancer address from a jobId.
const ESCROW_ABI = [
  'event AppliedToJob(uint256 indexed jobId, address indexed applicant)',
  'event ApplicantApproved(uint256 indexed jobId, address indexed freelancer)',
  'event MilestoneSubmitted(uint256 indexed jobId, uint256 milestoneIndex)',
  'event MilestoneApproved(uint256 indexed jobId, uint256 milestoneIndex)',
  'function getJob(uint256 jobId) view returns (tuple(uint256 jobId, address client, address freelancer, uint256 depositAmount, uint256 clientFee, uint256 availableForWork, uint256 amountReleased, bool poorWorkReported, bool clientFeeForwarded, uint8 category, uint8 status, uint256 createdAt, uint256 deadline))',
];

const DISPUTE_ABI = [
  'event DisputeOpened(uint256 indexed disputeId, uint256 indexed jobId, address indexed raisedBy)',
  'event DisputeResolved(uint256 indexed disputeId, uint8 winner)',
];

export class BlockchainListener {
  private provider: ethers.JsonRpcProvider;
  private escrowContract: ethers.Contract;
  private disputeContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(env.RPC_URL);
    this.escrowContract = new ethers.Contract(env.ESCROW_PLATFORM_ADDRESS, ESCROW_ABI, this.provider);
    this.disputeContract = new ethers.Contract(env.DISPUTE_DAO_ADDRESS, DISPUTE_ABI, this.provider);

    // ethers polls its event filters every few seconds; many RPC providers
    // (especially public/free ones) garbage-collect filters quickly, which
    // surfaces as `-32001 resource not found`. The listener auto-recovers
    // by recreating the filter, so the noise is cosmetic — silence it.
    this.provider.on('error', (err: unknown) => {
      const e = err as { error?: { code?: number }; code?: string };
      if (e?.error?.code === -32001) return;
      if (e?.code === 'UNKNOWN_ERROR' && e?.error?.code === -32001) return;
      console.error('Provider error:', err);
    });
  }

  public start() {
    console.log('🚀 Blockchain Listener started...');
    this.setupEscrowListeners();
    this.setupDisputeListeners();
  }

  private async getEmail(walletAddress: string): Promise<string | null> {
    try {
      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      return user ? user.email : null;
    } catch (error) {
      console.error(`Error fetching email for ${walletAddress}:`, error);
      return null;
    }
  }

  private setupEscrowListeners() {
    // 1. AppliedToJob -> Notify Client
    this.escrowContract.on('AppliedToJob', async (jobId, applicant) => {
      try {
        // Need to fetch job details to find the client address
        // For now, we assume the job details can be fetched via contract
        const job = await this.escrowContract.getJob(jobId);
        const clientEmail = await this.getEmail(job.client);
        
        if (clientEmail) {
          await sendNotificationEmail(
            clientEmail,
            'New Application for Your Job',
            `<p>A new freelancer (${applicant}) has applied for your job #${jobId}.</p>`
          );
        }
      } catch (err) {
        console.error('Error in AppliedToJob listener:', err);
      }
    });

    // 2. ApplicantApproved -> Notify Freelancer
    this.escrowContract.on('ApplicantApproved', async (jobId, freelancer) => {
      const email = await this.getEmail(freelancer);
      if (email) {
        await sendNotificationEmail(
          email,
          "You've Been Approved!",
          `<p>Congratulations! You have been approved for job #${jobId}. You can start working now.</p>`
        );
      }
    });

    // 3. MilestoneSubmitted -> Notify Client
    this.escrowContract.on('MilestoneSubmitted', async (jobId, milestoneIndex) => {
      try {
        const job = await this.escrowContract.getJob(jobId);
        const email = await this.getEmail(job.client);
        if (email) {
          await sendNotificationEmail(
            email,
            'Milestone Submitted',
            `<p>The freelancer has submitted work for milestone ${milestoneIndex} of job #${jobId}. Please review it.</p>`
          );
        }
      } catch (err) {
        console.error('Error in MilestoneSubmitted listener:', err);
      }
    });

    // 4. MilestoneApproved -> Notify Freelancer
    this.escrowContract.on('MilestoneApproved', async (jobId, milestoneIndex) => {
      try {
        const job = await this.escrowContract.getJob(jobId);
        const email = await this.getEmail(job.freelancer);
        if (email) {
          await sendNotificationEmail(
            email,
            'Milestone Approved',
            `<p>Milestone ${milestoneIndex} for job #${jobId} has been approved and payment released.</p>`
          );
        }
      } catch (err) {
        console.error('Error in MilestoneApproved listener:', err);
      }
    });
  }

  private setupDisputeListeners() {
    // 5. DisputeOpened -> Notify Both (simplified for MVP)
    this.disputeContract.on('DisputeOpened', async (disputeId, jobId) => {
       try {
        const job = await this.escrowContract.getJob(jobId);
        const clientEmail = await this.getEmail(job.client);
        const freelancerEmail = await this.getEmail(job.freelancer);

        const content = `<p>A dispute (#${disputeId}) has been opened for job #${jobId}. Please submit your evidence.</p>`;
        
        if (clientEmail) await sendNotificationEmail(clientEmail, 'Dispute Opened', content);
        if (freelancerEmail) await sendNotificationEmail(freelancerEmail, 'Dispute Opened', content);
      } catch (err) {
        console.error('Error in DisputeOpened listener:', err);
      }
    });
  }
}

export const blockchainListener = new BlockchainListener();
