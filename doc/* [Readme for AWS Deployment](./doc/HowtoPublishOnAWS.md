# How to publish this frontend on AWS (Amazon Web Service)

First draft, just some quick notes.


## Step 1: Create a Free AWS Account
To get started, create a free AWS account by visiting the [AWS Free Tier](https://aws.amazon.com/free) page.

## Step 2: Publish the Frontend on Amazon Elastic Beanstalk
1. Access the [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/home) in your preferred region. For example, select "Frankfurt" as your region from the drop-down menu in the upper right corner.
2. Note that selecting the region may cause the AWS Web frontend to return to the main screen. If this happens, reselect "Elastic Beanstalk Console" from the drop-down menu in the upper left corner.

### Step 2.1: Create a New Environment
1. Prepare the distributable files that you will upload to the server.
   - Run the command `npm run build` to create a "dist" directory.
   - Zip the contents of the "dist" directory (not the directory itself) following the instructions in the [AWS Elastic Beanstalk documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-sourcebundle.html). This zip file will be copied to the server's `/var/app/current` directory during deployment.
   - The server will use Node.js to execute your JavaScript code and will run it under the system user "webapp".
2. Set up a [post deploy hook](https://aws.amazon.com/blogs/devops/understanding-the-aws-elastic-beanstalk-deployment-process-part-3-post-deploy-actions/) as a shell script that will be executed with root privileges.

### Step 2.2: Create the Environment
1. In the Elastic Beanstalk Console, click on "Create environment" and fill out the necessary forms.
   - Note: This entire process can also be scripted using the [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) (Elastic Beanstalk Command Line Interface).
   - To use the EB CLI, you will need to have Python installed on your machine.
   - Install the EB CLI by running the command `pip3 install awsebcli`.
   - Ensure that any network restrictions, such as ZScaler, are disabled to allow the EB CLI to function properly.

By following these steps, you will be able to successfully publish your frontend on AWS using Amazon Elastic Beanstalk.
