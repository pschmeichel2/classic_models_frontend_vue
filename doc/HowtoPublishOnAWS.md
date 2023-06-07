# How to publish this frontend on AWS (Amazon Web Service)

First draft, just some quick notes.


## Create a Free AWS Account
To get started, create a free AWS account by visiting the [AWS Free Tier](https://aws.amazon.com/free) page.

## Publish the Frontend on Amazon Elastic Beanstalk
1. Access the [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/home) in your preferred region. For example, select "Frankfurt" as your region from the drop-down menu in the upper right corner.
2. Note that selecting the region may cause the AWS Web frontend to return to the main screen. If this happens, reselect "Elastic Beanstalk Console" from the drop-down menu in the upper left corner.

## Prepare the distributable
### Execute the production build
* Prepare the distributable files that you will upload to the server:
   * Run the command `npm run build` to create a "dist" directory.

### Set up a post deploy hook   
   * Set up a [post deploy hook](https://aws.amazon.com/blogs/devops/understanding-the-aws-elastic-beanstalk-deployment-process-part-3-post-deploy-actions/) as a shell script that will be executed with root privileges after the deployment.
      * The shell script must be located in the directory `.platform\hooks\postdeploy` under your `dist` directory.
      * The shell script is a file with `.sh` file extension, starting with the line `#!/usr/bin/env bash`. 
      * It's content will be executed with root privileges, after your code was copied to the `/var/app/current` directory.

### Prepare the entry point to your app
* The server uses node.js to execute your javascript code.
* It will look into your `dist` directory for an [entry point](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html).
   * First, it will look for a `package.json` file and execute `npm start`. 
      * This executes the `scripts - start` line in your package.json file.      
   * If no package.json is found, it will look for an `app.js` or `server.js`.

#### **How to make this work with a Vue app that was generated with vue cli?**
Instead of *just* describing the solution, I'll explain this step by step.

* **Problem**: [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html) doesn't generate an app.js, server.js, or a package.json in the 'dist'-directory.
   * **Solution**: Copy the `package.json` into the 'dist'-directory manually.
* **Problem**: By default, the server executes the command specified in the "start" script of the `package.json` file. 
   * **Solution**: Update the "start" script in the package.json file to `"start": "serve"`. This ensures that the server uses the serve command with the '/var/app/current' directory as the root when starting your app.
* **Problem**: The server should execute `npm install` to install all your node packages. Sometimes it just doesn't.
   * **Solution**: Execute `npm install` from your post deploy hook.
* **Problem**: The server doesn't know the `serve` command. On your development computer, you would install Vue's `serve` with `npm install -g serve`. The beanstalk server doesn't know about Vue, so it doesn`t do that.  
   * **Solution**: Execute this command in your post deploy hook.
* **Problem**: The server *still* doesn't know the `serve` command. On your local computer, the command  `npm install -g serve` would generate a powershell script in your path named "serve.ps1". On the server, the node packages get installed, but no script "serve" (this is maybe a permissions problem).
   * **Solution**: call the `serve` package directly from your package.json start script: `/opt/elasticbeanstalk/node-install/node-v18.16.0-linux-x64/bin/serve`.
* **Problem**: The web server is now running. You can test this by executing this script in the ssh shell, opening a second shell, and execute `curl localhost`. This should return a web page. **But**: the web server isn't reachable from outside the server.   
   * **Solution**: nginx expects the webserver to serve on port 8080. So we'll have to change the `serve`: `/opt/elasticbeanstalk/node-install/node-v18.16.0-linux-x64/bin/serve -l 8080`

### Zip the distributable
   - Zip the contents of the "dist" directory (not the directory itself) following the instructions in the [AWS Elastic Beanstalk documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-sourcebundle.html). The contents of the zip file will be copied to the server's `/var/app/current` directory during deployment.
   - The server will use Node.js to execute your JavaScript code and will run it under the system user "webapp".

## Create the Environment
* In the Elastic Beanstalk Console, click on "Create environment" and fill out the necessary forms.
* TODO


## Testing and Troubleshooting

### Testing:
* After creating your environment, Elastic Beanstalk (EB) requires a few minutes to prepare and start the environment. Once it's ready, the "Health" status should show as "ok," indicating that a web server is running in your environment.
* Click on the "domain" link provided to check if the web server is reachable.


### Troubleshooting:

If you encounter any issues, here are some troubleshooting steps you can follow:

#### Downloading and Viewing Log Files:
   - Download the log files from the EB console by navigating to your environment, accessing the "Logs" tab, and selecting "Request logs / full."
   - Unpack the logs and open the directory containing the unpacked logs using a tool like Microsoft Code.

#### EB CLI (Elastic Beanstalk Command Line Interface)
   - The installation process can also be scripted using the [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html).
      - To use the EB CLI, you need to have Python installed on your machine.
      - Install the EB CLI by running the command `pip3 install awsebcli`.
      - Ensure that any network restrictions, such as ZScaler, are disabled to allow the EB CLI to function properly.

#### Accessing the Server via SSH:
   - To access your server via SSH, use the command `eb ssh`.
   - Ensure that the "EB CLI" is installed by running the command `pip3 install awsebcli`.
   - Set up SSH keys by following the instructions provided in this [guide](https://bobcares.com/blog/connect-elastic-beanstalk-instance-via-ssh/).
   - Set up SSH access to your server using the command `eb ssh xxx-env --setup`.

#### Logging into the Server:
   - Once SSH access is set up, use the command `eb ssh xxx-env` to log in to your server.
   - You will be logged in as the 'ec2-user,' and you can use sudo without a password.
   - Your application files can be found in the `/var/app/current` directory.

#### Useful Linux Shell Commands:
   - `pwd`: Print the name of the current directory.
   - `whoami`: Print the name of the current user.
   - `ls`: Print the contents of the current directory.
   - `echo "$PATH"`: Print the system's executable search path.
   - `sudo find / -name "*myfile*"`: Find a file named "myfile" by searching the entire system.
   - `which npm`: Print the path of the npm executable.
   - `service nginx status`: Print the status of the reverse proxy server [nginx](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/java-se-nginx.html).
   - `sudo -Hiu webapp env`: Print the environment variables seen by the user 'webapp'.

## Conclusion
In summary, the provided approach may not be considered highly professional or robust when dealing with system changes. However, it can still serve the purpose adequately without encountering significant issues.