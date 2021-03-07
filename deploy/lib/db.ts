import * as cdk from '@aws-cdk/core';

// dynamo 
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class Database extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, tableName: string, replicationRegion: string[], props?: cdk.StackProps) {
    super(scope, id, props);
    const table = new dynamodb.Table(this, tableName,{
      partitionKey: {name: "userid", type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      replicationRegions: replicationRegion,
      tableName: tableName
    })  
  }

}

