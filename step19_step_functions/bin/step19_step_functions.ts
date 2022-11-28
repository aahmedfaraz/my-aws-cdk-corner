#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Step19StepFunctionsStack } from '../lib/step19_step_functions-stack';

const app = new cdk.App();
new Step19StepFunctionsStack(app, 'ahmed-step-func-stack', {
  stackName: 'ahmed-step-func-stack',
  tags: {
    service: 'ahmed-step-func-stack'
  }
});