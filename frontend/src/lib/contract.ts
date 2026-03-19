import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  boolCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

// Contract deployment info — update these for your deployment
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = 'DynamicHealth';
const NETWORK = STACKS_TESTNET;

interface ContractCallOptions {
  functionName: string;
  functionArgs: any[];
  postConditions?: any[];
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

/** Build options for openContractCall from @stacks/connect */
export function buildContractCallOptions(opts: ContractCallOptions) {
  return {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: opts.functionName,
    functionArgs: opts.functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: opts.postConditions || [],
    onFinish: opts.onFinish,
    onCancel: opts.onCancel,
  };
}

/** Build create-health-profile contract call */
export function buildCreateHealthProfile(data: {
  age: number;
  bmi: number;
  systolic: number;
  diastolic: number;
  cholesterol: number;
  isSmoker: boolean;
  exerciseFreq: number;
}) {
  return buildContractCallOptions({
    functionName: 'create-health-profile',
    functionArgs: [
      uintCV(data.age),
      uintCV(data.bmi),
      uintCV(data.systolic),
      uintCV(data.diastolic),
      uintCV(data.cholesterol),
      boolCV(data.isSmoker),
      uintCV(data.exerciseFreq),
    ],
  });
}

/** Build update-lifestyle-metrics contract call */
export function buildUpdateLifestyleMetrics(data: {
  steps: number;
  sleepHours: number;
  stress: number;
  dietScore: number;
  mentalScore: number;
}) {
  return buildContractCallOptions({
    functionName: 'update-lifestyle-metrics',
    functionArgs: [
      uintCV(data.steps),
      uintCV(data.sleepHours),
      uintCV(data.stress),
      uintCV(data.dietScore),
      uintCV(data.mentalScore),
    ],
  });
}

/** Build create-insurance-policy contract call */
export function buildCreateInsurancePolicy() {
  return buildContractCallOptions({
    functionName: 'create-insurance-policy',
    functionArgs: [],
  });
}

/** Build pay-premium contract call */
export function buildPayPremium(policyId: number, premiumAmount: number, senderAddress: string) {
  return buildContractCallOptions({
    functionName: 'pay-premium',
    functionArgs: [uintCV(policyId)],
    postConditions: [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        premiumAmount
      ),
    ],
  });
}

/** Build the comprehensive health risk assessment call */
export function buildRiskAssessment(data: {
  policyId: number;
  includePredictiveModeling: boolean;
  enableWellnessIncentives: boolean;
  activateContinuousMonitoring: boolean;
  generateInterventionRecommendations: boolean;
}) {
  return buildContractCallOptions({
    functionName: 'execute-comprehensive-health-risk-assessment-and-premium-optimization',
    functionArgs: [
      uintCV(data.policyId),
      boolCV(data.includePredictiveModeling),
      boolCV(data.enableWellnessIncentives),
      boolCV(data.activateContinuousMonitoring),
      boolCV(data.generateInterventionRecommendations),
    ],
  });
}
