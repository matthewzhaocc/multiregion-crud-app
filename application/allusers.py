"""
    returns all user in db
"""
import os
import json
import boto3

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    return {
        "body": json.dumps(client.scan(
            TableName=os.environ["TABLE_NAME"]
        )["Items"]),
        "headers": {
            "Content-Type": "application/json"
        }
    }