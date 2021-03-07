#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Application } from '../lib/app';
import { Database } from '../lib/db';
const app = new cdk.App();

new Database(app, "BackendDBMulti", "MultiRegionAppDB", ["us-east-1"], {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
})

const appwest = new Application(app, "ApplicationMultiWest", "MultiRegionAppDB", "multiapp.ihatemyself.xyz", "ihatemyself.xyz", "Z0282398R4BTQCQCYHSP", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: "us-west-2"
    }
})

const appeast = new Application(app, "ApplicationMultiEast", "MultiRegionAppDB", "multiapp.ihatemyself.xyz", "ihatemyself.xyz", "Z0282398R4BTQCQCYHSP", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: "us-east-1"
    }
})