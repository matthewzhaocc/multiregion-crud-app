import * as cdk from '@aws-cdk/core';

// lambda
import * as lambda from '@aws-cdk/aws-lambda';
import { ManagedPolicy } from '@aws-cdk/aws-iam';

// api gw
import * as apigateway from '@aws-cdk/aws-apigateway';

// cert
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
export class Application extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, tableName: string, domainName: string, zoneName: string, zoneId: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const AllUserFn = new lambda.Function(
        this,
        "MultiRegFunct",
        {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: "allusers.lambda_handler",
            code: lambda.Code.fromAsset(
                "../application/app.zip"
            ),
            environment: {
                "TABLE_NAME": tableName
            }
        }
    )
    const NewUserFn = new lambda.Function(
        this,
        "MultiRegFunctNewUser",
        {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: "newuser.lambda_handler",
            code: lambda.Code.fromAsset(
                "../application/app.zip"
            ),
            environment: {
                "TABLE_NAME": tableName
            }
        }
    )
    AllUserFn.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"))
    NewUserFn.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"))
    const api = new apigateway.RestApi(this, "MultiAppGw", {
        endpointTypes: [apigateway.EndpointType.REGIONAL]
    });
    const integration = new apigateway.LambdaIntegration(AllUserFn)
    const users = api.root.addResource("users");
    const allUsers = users.addMethod("GET", integration, { apiKeyRequired: false})
    const adduser = users.addMethod("PUT", new apigateway.LambdaIntegration(NewUserFn), {apiKeyRequired: false})
    const DNSZone = route53.HostedZone.fromHostedZoneAttributes(this, "DnsZone", {
        hostedZoneId: zoneId,
        zoneName: zoneName
    })
    const cert = new acm.Certificate(this, "cert", {
        domainName: domainName,
        validation: acm.CertificateValidation.fromDns(DNSZone)
    })
    const domain = new apigateway.DomainName(this, "multiApp", {
        domainName: domainName,
        certificate: cert,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2
    })
    domain.addBasePathMapping(api)
    const rec = new route53.CnameRecord(this, "AliastoAPI", {
        zone: DNSZone,
        recordName: props?.env?.region + "." + "multiapp",
        domainName: domain.domainNameAliasDomainName,
        
        
    })
    const cert2 = new acm.Certificate(this, "cert2", {
        domainName: "dev-"+props?.env?.region+"."+domainName,
        validation: acm.CertificateValidation.fromDns(DNSZone)
    })
    const domain2 = new apigateway.DomainName(this, "multiapp2", {
        domainName: "dev-"+props?.env?.region+"."+domainName,
        certificate: cert2,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2
    })
    domain2.addBasePathMapping(api)
    const rec2 = new route53.CnameRecord(this, "dev-alias", {
        zone: DNSZone,
        recordName: "dev-"+props?.env?.region+"."+domainName,
        domainName: domain2.domainNameAliasDomainName
    })
  }
 
}

