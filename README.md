# DevOps Application

An end-to-end DevOps project demonstrating how to build, containerize, deploy, automate, and monitor a Node.js application using modern DevOps tools.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technologies Used](#3-technologies-used)
4. [Project Directory Structure](#4-project-directory-structure)
5. [Application Details](#5-application-details)
6. [Docker and Docker Compose](#6-docker-and-docker-compose)
7. [Git and GitHub](#7-git-and-github)
8. [Jenkins CI/CD Pipeline](#8-jenkins-cicd-pipeline)
9. [Kubernetes Deployment](#9-kubernetes-deployment)
10. [Jenkins Kubernetes RBAC](#10-jenkins-kubernetes-rbac)
11. [Monitoring with Prometheus and Grafana](#11-monitoring-with-prometheus-and-grafana)
12. [Testing and Verification](#12-testing-and-verification)
13. [Important Commands and Explanations](#13-important-commands-and-explanations)
14. [Security Considerations](#14-security-considerations)
15. [Troubleshooting](#15-troubleshooting)
16. [Future Improvements](#16-future-improvements)

---

## 1. Project Overview

**Project Name:** DevOps Application

**GitHub Repository:** https://github.com/shubhamgaonkar0797/devops-application

**Docker Hub Image:** `shubham0797/devops-application`

The objective of this project is to implement an end-to-end DevOps workflow.

We create a Node.js application connected to a PostgreSQL database, package the application into a Docker image, automate the build and deployment process using Jenkins, deploy the application to Kubernetes, and monitor the infrastructure using Prometheus and Grafana.

### Project Objectives

- Develop a Node.js application using Express.
- Connect the application to PostgreSQL.
- Containerize the application using Docker.
- Manage application and database containers using Docker Compose.
- Maintain application source code in GitHub.
- Automate CI/CD using Jenkins.
- Automatically trigger Jenkins builds through GitHub Webhooks.
- Build and push Docker images to Docker Hub.
- Deploy the application and database to Kubernetes.
- Use Kubernetes Deployments, Services, Secrets, and Persistent Volume Claims.
- Configure Jenkins access to Kubernetes using RBAC.
- Monitor EC2 infrastructure using Prometheus, Node Exporter, and Grafana.

## 2. Architecture

### Application and CI/CD Architecture

```text
Developer
    |
    | Git Push
    v
GitHub Repository
    |
    | GitHub Webhook
    v
Jenkins CI/CD Pipeline
    |
    | Checkout Source Code
    | Verify Required Files
    | Build Docker Image
    v
Docker Image
    |
    | Push
    v
Docker Hub
    |
    | Pull Image
    v
Kubernetes / Minikube
    |
    +----------------------+
    |                      |
    v                      v
Application Pods       PostgreSQL Pod
    |                      |
    +----------+-----------+
               |
          Kubernetes
            Services
```

### Monitoring Architecture

```text
EC2 Infrastructure
       |
       v
Node Exporter
       |
       | Metrics
       v
Prometheus
       |
       | PromQL Queries
       v
Grafana Dashboards
```

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Linux / Ubuntu | Server operating system |
| AWS EC2 | Cloud virtual machine |
| Node.js | Application runtime |
| Express.js | Backend web framework |
| PostgreSQL | Relational database |
| Git | Version control |
| GitHub | Source code repository |
| Docker | Application containerization |
| Docker Compose | Multi-container management |
| Docker Hub | Container image registry |
| Jenkins | CI/CD automation |
| GitHub Webhooks | Automatic pipeline triggering |
| Kubernetes | Container orchestration |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes command-line tool |
| Prometheus | Metrics collection |
| Node Exporter | Linux infrastructure metrics |
| Grafana | Monitoring dashboards |

## 4. Project Directory Structure

```text
devops-application/
│
├── app/
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── kubernetes/
│   ├── namespace.yaml
│   ├── app-deployment.yaml
│   ├── app-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── postgres-pvc.yaml
│   └── jenkins-rbac.yaml
│
├── monitoring/
│   ├── compose.yaml
│   └── prometheus/
│       └── prometheus.yml
│
├── Jenkinsfile
├── compose.yaml
└── README.md
```

Additional local files such as `.env`, Kubernetes secret manifests, and backup files are not part of the intended public repository.

## 5. Application Details

The application is developed using Node.js and Express.

### Dependencies

The `app/package.json` file defines the application dependencies:

- `express`: Handles HTTP requests and serves the application.
- `pg`: Provides connectivity between Node.js and PostgreSQL.

### Application Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Displays the Cloud Operations Dashboard |
| `/health` | Checks application health |
| `/api/info` | Returns application information |
| `/db-test` | Tests PostgreSQL connectivity |

### Health Check

```bash
curl http://localhost:8082/health
```

Expected response:

```json
{
  "application": "DevOps Application",
  "status": "UP",
  "message": "DevOps Application is healthy"
}
```

### Application Information

```bash
curl http://localhost:8082/api/info
```

This endpoint returns the application name, version, environment, hostname, and timestamp.

### Database Connectivity Test

```bash
curl http://localhost:8082/db-test
```

A successful response contains:

```json
{
  "application": "DevOps Application",
  "database": "PostgreSQL",
  "status": "CONNECTED"
}
```

## 6. Docker and Docker Compose

### 6.1 Dockerfile

Location: `app/Dockerfile`

The Dockerfile defines how the application Docker image is built.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8082

CMD ["npm", "start"]
```

**Explanation:**

| Instruction | Purpose |
|---|---|
| `FROM` | Selects the base Docker image |
| `WORKDIR` | Sets the working directory inside the container |
| `COPY` | Copies files into the image |
| `RUN` | Executes commands while building the image |
| `npm ci --omit=dev` | Installs production dependencies from the lock file |
| `EXPOSE` | Documents the application's container port |
| `CMD` | Starts the application when the container runs |

The application listens on port `8082`, so the Dockerfile should also document port `8082`.

### 6.2 Build Docker Image

```bash
cd ~/devops-application

docker build -t devops-application:1.0 ./app
```

Explanation:

- `docker build`: Builds an image.
- `-t`: Assigns a name and tag.
- `devops-application:1.0`: Image name and version.
- `./app`: Build context containing the Dockerfile and application files.

### 6.3 View Docker Images

```bash
docker images
```

Displays locally available Docker images.

### 6.4 Run Docker Container

```bash
docker run -d \
  --name devops-application \
  -p 8082:8082 \
  devops-application:1.0
```

Explanation:

- `-d`: Runs the container in the background.
- `--name`: Assigns a container name.
- `-p`: Maps the host port to the container port.

### 6.5 Docker Compose

Location: `compose.yaml`

Docker Compose manages the application and PostgreSQL database together.

Services:

1. `app`: Node.js application.
2. `database`: PostgreSQL database.

The application connects to PostgreSQL using the Docker Compose service name `database`.

The database uses a named volume called `postgres-data` for persistent storage.

### Environment Variables

The Compose configuration expects these variables in a local `.env` file:

```dotenv
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_strong_password
```

Use your actual lab values in the local `.env` file. Never commit this file to GitHub.

### Docker Compose Commands

```bash
docker compose config --quiet
```

Validates the Compose configuration.

```bash
docker compose config --services
```

Displays configured service names.

```bash
docker compose config --images
```

Displays the images used by the services.

```bash
docker compose up -d --build
```

Builds images if required and starts services in the background.

```bash
docker compose ps
```

Displays the status of Compose containers.

```bash
docker compose logs -f
```

Displays live logs from Compose services.

```bash
docker compose restart
```

Restarts the services.

```bash
docker compose down
```

Stops and removes the Compose containers and network. Named volumes are retained unless explicitly removed.

**Important:** Do not use `docker compose down -v` unless you intentionally want to delete the database volume and its stored data.

## 7. Git and GitHub

Git is used for version control, while GitHub hosts the project repository.

### Clone Repository

```bash
git clone https://github.com/shubhamgaonkar0797/devops-application.git
```

### Enter Project Directory

```bash
cd devops-application
```

### Check Current Branch

```bash
git branch
```

### Check Repository Status

```bash
git status
```

### Stage Files

```bash
git add app/public/index.html compose.yaml monitoring/
```

Stage only the files intended for the commit. Avoid adding secrets, `.env`, or backup files.

### Commit Changes

```bash
git commit -m "Update dashboard and monitoring configuration"
```

### Push Changes

```bash
git push origin main
```

### Pull Latest Changes

```bash
git pull origin main
```

### View Commit History

```bash
git log --oneline
```

## 8. Jenkins CI/CD Pipeline

Jenkins automates the build, verification, image publishing, and Kubernetes deployment process.

### Pipeline File

Location: `Jenkinsfile`

The pipeline contains the following stages:

1. Checkout
2. Verify Files
3. Build Docker Image
4. Verify Docker Image
5. Push to Docker Hub
6. Deploy to Kubernetes
7. Verify Kubernetes Deployment

### Pipeline Workflow

**Stage 1: Checkout**

Jenkins retrieves the source code from the configured GitHub repository.

**Stage 2: Verify Files**

Jenkins checks that required application and Kubernetes configuration files exist.

**Stage 3: Build Docker Image**

Jenkins builds two tags:

```text
shubham0797/devops-application:<BUILD_NUMBER>
shubham0797/devops-application:latest
```

The build number provides a unique image version for each Jenkins build.

**Stage 4: Verify Docker Image**

Jenkins runs:

```bash
docker images shubham0797/devops-application
```

**Stage 5: Push to Docker Hub**

Jenkins uses the configured Jenkins credential ID:

```text
dockerhub-creds
```

The Docker Hub token is supplied securely through Jenkins credentials rather than being written directly into the Jenkinsfile.

**Stage 6: Deploy to Kubernetes**

Jenkins applies the Kubernetes configuration files and updates the application deployment to use the image built by the current pipeline run.

**Stage 7: Verify Kubernetes Deployment**

Jenkins waits for the PostgreSQL and application Deployments to complete their rollouts.

It then lists Deployments, Pods, and Services.

### Jenkins Pipeline Environment Variables

| Variable | Purpose |
|---|---|
| `DOCKER_IMAGE` | Docker Hub image name |
| `BUILD_NUMBER` | Jenkins build number |
| `KUBECONFIG` | Jenkins Kubernetes configuration file |
| `K8S_NAMESPACE` | Kubernetes namespace |

### Jenkins Job Configuration

The Jenkins job is named:

```text
DevOps-Application-CI-CD
```

Important configuration:

- Pipeline definition: Pipeline script from SCM.
- SCM: Git.
- Repository: `https://github.com/shubhamgaonkar0797/devops-application.git`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

### GitHub Webhook Integration

A GitHub webhook automatically notifies Jenkins when code is pushed.

Webhook payload URL:

```text
http://YOUR_JENKINS_PUBLIC_IP:8080/github-webhook/
```

GitHub webhook configuration:

- Content type: `application/json`
- Event: Just the push event
- Active: Enabled

In Jenkins, enable:

```text
GitHub hook trigger for GITScm polling
```

Replace the example IP with the current Jenkins server address. The Jenkins endpoint should be secured before using this setup in production.

### CI/CD Result

When a developer pushes code to the `main` branch:

1. GitHub sends a webhook.
2. Jenkins starts the pipeline.
3. Jenkins checks out the latest code.
4. Jenkins verifies the required files.
5. Jenkins builds a Docker image.
6. Jenkins pushes the image to Docker Hub.
7. Jenkins deploys the new image to Kubernetes.
8. Jenkins verifies the rollout.

## 9. Kubernetes Deployment

Kubernetes manages the application and PostgreSQL containers.

The project uses Minikube as its Kubernetes cluster.

### 9.1 Kubernetes Namespace

File: `kubernetes/namespace.yaml`

Namespace:

```text
devops-application
```

A namespace logically separates project resources from other Kubernetes resources.

Apply it:

```bash
kubectl apply -f kubernetes/namespace.yaml
```

### 9.2 Application Deployment

File: `kubernetes/app-deployment.yaml`

Important configuration:

- Deployment name: `devops-application`
- Replicas: `2`
- Container port: `8082`
- Image: `shubham0797/devops-application:latest`
- Readiness probe: `/health`
- Liveness probe: `/health`
- Resource requests and limits are configured.

Two application replicas help demonstrate application availability and scaling.

### 9.3 Application Service

File: `kubernetes/app-service.yaml`

Service name:

```text
devops-application
```

Service type:

```text
ClusterIP
```

The Service provides a stable internal endpoint for accessing the application Pods.

### 9.4 PostgreSQL Deployment

File: `kubernetes/postgres-deployment.yaml`

PostgreSQL runs as a Kubernetes Deployment with one replica.

Important configuration:

- Image: `postgres:16-alpine`
- Container port: `5432`
- Secret-based environment variables
- Persistent volume mount
- Readiness and liveness probes using `pg_isready`

### 9.5 PostgreSQL Service

File: `kubernetes/postgres-service.yaml`

Service name:

```text
postgres
```

The application connects to PostgreSQL through the internal Kubernetes DNS name:

```text
postgres:5432
```

### 9.6 Persistent Volume Claim

File: `kubernetes/postgres-pvc.yaml`

The PostgreSQL PVC requests:

```text
Storage: 2Gi
Access Mode: ReadWriteOnce
```

A Persistent Volume Claim requests storage for the database.

This helps preserve database files beyond the lifetime of an individual PostgreSQL Pod, subject to the underlying storage configuration.

### 9.7 Kubernetes Secrets

The application and PostgreSQL Deployment use a Kubernetes Secret named:

```text
postgres-secret
```

The Secret provides database configuration without hardcoding database credentials in the Deployment manifests.

The actual secret manifest is intentionally excluded from the public repository.

### 9.8 Start Minikube

```bash
minikube start --driver=docker
```

Starts a Kubernetes cluster using Docker as the driver.

### 9.9 Check Cluster Status

```bash
minikube status
```

Displays the Minikube cluster status.

### 9.10 Check Kubernetes Nodes

```bash
kubectl get nodes
```

Displays the Kubernetes nodes.

### 9.11 Check Namespace

```bash
kubectl get namespaces
```

Lists Kubernetes namespaces.

### 9.12 Apply Kubernetes Manifests

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/postgres-pvc.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/app-deployment.yaml
kubectl apply -f kubernetes/app-service.yaml
```

The `kubectl apply -f` command creates or updates resources from YAML files.

### 9.13 Check Pods

```bash
kubectl get pods -n devops-application
```

Displays Pods in the project namespace.

### 9.14 Check Deployments

```bash
kubectl get deployments -n devops-application
```

Displays Deployment status and replica counts.

### 9.15 Check Services

```bash
kubectl get services -n devops-application
```

Displays Kubernetes Services.

### 9.16 Check Persistent Volume Claims

```bash
kubectl get pvc -n devops-application
```

Displays storage claims and their status.

### 9.17 Check Application Logs

```bash
kubectl logs deployment/devops-application -n devops-application
```

Displays application container logs.

### 9.18 Port Forwarding

```bash
kubectl port-forward service/devops-application 8083:8082 -n devops-application
```

This forwards local port `8083` to the application Service port `8082`.

Keep this command running in one terminal and test the application from another terminal:

```bash
curl http://localhost:8083/health
```

## 10. Jenkins Kubernetes RBAC

File: `kubernetes/jenkins-rbac.yaml`

RBAC stands for Role-Based Access Control.

It controls what Jenkins is permitted to do inside Kubernetes.

This project creates:

- ServiceAccount: `jenkins-deployer`
- Role: `jenkins-deployer-role`
- RoleBinding: `jenkins-deployer-binding`

The Role grants the Jenkins ServiceAccount permissions to manage selected Deployments, ReplicaSets, Pods, Services, and Persistent Volume Claims within the `devops-application` namespace.

### Apply RBAC

```bash
kubectl apply -f kubernetes/jenkins-rbac.yaml
```

### Verify ServiceAccount

```bash
kubectl get serviceaccounts -n devops-application
```

### Verify Role

```bash
kubectl get roles -n devops-application
```

### Verify RoleBinding

```bash
kubectl get rolebindings -n devops-application
```

### Verify Permissions

```bash
kubectl auth can-i get pods \
  --as=system:serviceaccount:devops-application:jenkins-deployer \
  -n devops-application
```

The service account should have permission to access Pods in its namespace.

It is intentionally not granted unrestricted cluster-wide access.

## 11. Monitoring with Prometheus and Grafana

Monitoring is implemented using:

1. Prometheus
2. Node Exporter
3. Grafana

### 11.1 Prometheus

Prometheus collects and stores metrics.

Configuration file:

```text
monitoring/prometheus/prometheus.yml
```

Scrape interval:

```yaml
scrape_interval: 15s
```

Configured scrape jobs:

- Prometheus
- Node Exporter

Prometheus collects metrics from Node Exporter using:

```text
host.docker.internal:9100
```

### 11.2 Node Exporter

Node Exporter collects Linux server metrics, including:

- CPU usage
- Memory usage
- Filesystem usage
- System statistics

Container image:

```text
prom/node-exporter:v1.9.1
```

Node Exporter uses host networking to expose host metrics.

### 11.3 Grafana

Grafana displays monitoring information using dashboards and panels.

Container image:

```text
grafana/grafana:12.2.0
```

Grafana uses Prometheus as its data source.

Prometheus data source URL inside the monitoring Compose network:

```text
http://prometheus:9090
```

### 11.4 Start Monitoring Stack

From the project directory:

```bash
cd ~/devops-application/monitoring
docker compose up -d
```

This starts Prometheus, Node Exporter, and Grafana.

### 11.5 Check Monitoring Containers

```bash
docker compose ps
```

### 11.6 Check Prometheus Targets

Open:

```text
http://localhost:9090/targets
```

The Prometheus and Node Exporter targets should show healthy status.

### 11.7 Open Grafana

Open:

```text
http://localhost:3000
```

Configure Prometheus as the data source and create dashboards.

### 11.8 Dashboard Metrics

The project dashboard includes CPU, memory, disk, and Node Exporter availability.

**CPU usage:**

```promql
100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))
```

**Memory usage:**

```promql
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)
```

**Disk usage:**

```promql
100 * (1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}))
```

**Node Exporter availability:**

```promql
up{job="node-exporter"}
```

These queries provide infrastructure-level metrics. Application-specific Prometheus instrumentation is not currently included.

## 12. Testing and Verification

### Application Health

```bash
curl http://localhost:8082/health
```

### Database Connectivity

```bash
curl http://localhost:8082/db-test
```

### Application Information

```bash
curl http://localhost:8082/api/info
```

### Docker Containers

```bash
docker ps
```

### Docker Images

```bash
docker images
```

### Kubernetes Pods

```bash
kubectl get pods -n devops-application
```

### Kubernetes Deployments

```bash
kubectl get deployments -n devops-application
```

### Kubernetes Services

```bash
kubectl get services -n devops-application
```

### Kubernetes Rollout Status

```bash
kubectl rollout status deployment/devops-application -n devops-application
```

### Prometheus Targets

```bash
curl -s http://localhost:9090/api/v1/targets
```

## 13. Important Commands and Explanations

| Command | Purpose |
|---|---|
| `pwd` | Displays current directory |
| `ls -l` | Lists files with details |
| `tree` | Displays directory structure |
| `cat filename` | Displays file contents |
| `vi filename` | Opens a file in the vi editor |
| `grep pattern filename` | Searches for matching text |
| `ps aux` | Displays running processes |
| `df -h` | Displays disk usage |
| `free -h` | Displays memory usage |
| `top` | Displays live system resource usage |
| `systemctl status jenkins` | Checks Jenkins service |
| `docker ps` | Lists running containers |
| `docker logs container_name` | Displays container logs |
| `docker inspect container_name` | Displays container details |
| `docker exec -it container_name sh` | Opens a shell inside a container |
| `kubectl get all -n devops-application` | Lists common Kubernetes resources |
| `kubectl describe pod POD_NAME -n devops-application` | Displays detailed Pod information |
| `kubectl logs POD_NAME -n devops-application` | Displays Pod logs |
| `kubectl delete pod POD_NAME -n devops-application` | Deletes a Pod; a Deployment may recreate it |
| `git status` | Displays Git working tree status |
| `git log --oneline` | Displays compact commit history |

## 14. Security Considerations

- Do not commit `.env` files.
- Do not commit database passwords.
- Do not commit Jenkins tokens.
- Store Docker Hub credentials in Jenkins Credentials.
- Use Kubernetes Secrets for database configuration.
- Use namespace-scoped RBAC for Jenkins.
- Avoid granting Jenkins cluster-admin privileges.
- Do not expose Node Exporter port `9100` publicly.
- Restrict access to Jenkins, Grafana, and other management interfaces.
- Use HTTPS and appropriate authentication for production services.
- Keep database storage persistent and back it up.

## 15. Troubleshooting

### Application container is not running

```bash
docker ps -a
docker logs devops-application
```

Check the container status and application logs.

### PostgreSQL connection failure

```bash
docker compose ps
docker compose logs database
docker compose logs app
```

Verify the database service, environment variables, and health check.

### Kubernetes Pod is not running

```bash
kubectl get pods -n devops-application
kubectl describe pod POD_NAME -n devops-application
kubectl logs POD_NAME -n devops-application
```

Check Pod events, image availability, secrets, and storage.

### Kubernetes API is unavailable

```bash
minikube status
minikube start --driver=docker
kubectl get nodes
```

Make sure Minikube is running and kubectl is connected to the correct cluster.

### Jenkins pipeline fails

Check:

- Jenkins Console Output.
- GitHub repository and branch configuration.
- Docker permissions for the Jenkins user.
- Docker Hub credential ID.
- Jenkins kubeconfig access.
- Kubernetes namespace and RBAC permissions.
- Availability of the required Kubernetes resources.

### Prometheus target is down

```bash
curl -s http://localhost:9090/api/v1/targets
```

Check the Prometheus configuration and Node Exporter container.

## 16. Future Improvements

The following improvements can be added as the project evolves:

- Terraform for AWS infrastructure provisioning.
- Ansible for server configuration and automation.
- Amazon ECR instead of Docker Hub.
- Argo CD for GitOps-based Kubernetes deployment.
- Centralized logging using an appropriate logging stack.
- HTTPS and reverse proxy configuration.
- Automated application and integration tests.
- Database backup and recovery automation.
- Production-grade secrets management.
- Kubernetes deployment on Amazon EKS.

---

## Project Outcome

This project demonstrates an end-to-end DevOps workflow using GitHub, Jenkins, Docker, Docker Hub, Kubernetes, PostgreSQL, Prometheus, Node Exporter, and Grafana.

It provides practical experience with source control, CI/CD automation, containerization, orchestration, database persistence, access control, and infrastructure monitoring.

**Repository:** https://github.com/shubhamgaonkar0797/devops-application
