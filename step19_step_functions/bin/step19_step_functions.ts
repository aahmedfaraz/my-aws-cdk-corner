#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Step19StepFunctionsStack } from '../lib/step19_step_functions-stack';

const app = new cdk.App();
new Step19StepFunctionsStack(app, 'ahmed-stack', {
  stackName: 'ahmed-stack',
  tags: {
    service: 'ahmed-stack'
  }
});