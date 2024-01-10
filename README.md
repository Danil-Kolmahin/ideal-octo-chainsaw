# ideal-octo-chainsaw

## Overview
An open-source project focused on creating a distributed system for generating and visualizing topographical maps. Utilizing procedural generation techniques, it aims to simulate terrains with varying elevations.
*Made as a practical project for the 6-course of Software Engineering, subject "Design of distributed systems"

## System Concept
### Functional requirements
**Use-case - diagram**
![Use-case diagram](/docs/use-case.svg)

### Non-functional requirements
Category | Source | Stimulus | Artifact | Response | Measure
-|-|-|-|-|-
Security | User | API request | API | Successful response from system | Required https and Basic auth
Recoverability | Error | Error occurrence | System | System recovery | Recovery time < 3m

## Getting Started
### Prerequisites
**Hardware**
- 8 GB / 2 CPUs (x86_64)
- 40 GB SSD Disk

**Operating system**
- Ubuntu 22.04.3

**Software**
- Node.js 20.10.0
- Docker 24.0.7
- Helm 3.13.3
- k3s 1.28.4

**Secrets**
- \$VERSION - could be obtained as `echo "VERSION=$(npm pkg get version | tr -d \")"`
- \$DATABASE_PASSWORD - for development useful to store at .env
- \$MESSAGE_BROKER_PASSWORD - for development useful to store at .env
- \$API_PASSWORD - for development useful to store at .env

### Setup
1. **Clone the repo**
   ```
   git clone git@github.com:Danil-Kolmahin/ideal-octo-chainsaw.git
   cd ideal-octo-chainsaw
   ```

2. **Install k3s cluster**
   ```
   curl -sfL https://get.k3s.io | sh -
   mkdir $HOME/.kube  
   sudo cp /etc/rancher/k3s/k3s.yaml $HOME/.kube/config  
   sudo chmod 644 $HOME/.kube/config
   echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Deploy ideal-octo-chainsaw**
   ```
   helm upgrade -i -f values.yaml ideal-octo-chainsaw . \
   --set version=$VERSION \
   --set secrets.DATABASE_PASSWORD=$DATABASE_PASSWORD \
   --set secrets.MESSAGE_BROKER_PASSWORD=$MESSAGE_BROKER_PASSWORD \
   --set secrets.API_PASSWORD=$API_PASSWORD
   ```

## Development
### Documentation
**Deployment diagram**
![Deployment diagram](/docs/deployment.svg)

**Sequence diagram**
![Sequence diagram](/docs/sequence.svg)

### System scaling
**handler**
```
kubectl scale deployment/handler --replicas=10
```

**api**
```
kubectl scale deployment/api --replicas=10
```

**database**

For scaling database see [this](https://www.postgresql.org/docs/current/runtime-config-replication.html)

**message-broker**

For scaling message-broker see [this](https://www.rabbitmq.com/ha.html)

### Backup
To configure the backup see [this](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)

### Monitoring
**database**
```
kubectl port-forward deployment/pgadmin 3003:80
```
After this command, on http://localhost:3003 you could use PgAdmin for database monitoring

**message-broker**
```
kubectl port-forward deployment/message-broker 15672:15672
```
After this command, on http://localhost:15672 you could use RabbitMQ Manager for message-broker monitoring

**ingresses**
```
kubectl port-forward -n kube-system deployment/traefik 9000:9000
```
After this command, on http://localhost:9000/dashboard/ you could use Traefik dashboard for monitoring cluster ingresses work

**overall**
```
kubectl port-forward service/prometheus-grafana 3000:80
```
After this command, on http://localhost:3000 you could use Grafana with Prometheus for monitoring nodes and cluster overall

### Security policies
Secret keys other than DOCKERHUB_TOKEN (which is only needed for CI/CD) and KUBECONFIG (which is on the cluster master node) are described in the "Secrets" section. Security measures mainly consist in the non-distribution of this secret information. In the rest, we rely on the protection provided by an encrypted SSL connection with the client, Basic auth, and the fact that the entire infrastructure, except for the ingress api, does not go beyond the cluster

### How to start locally
**Prepare environment**
```
kubectl port-forward deployment/database 5432:5432 # forward port from working database
kubectl port-forward deployment/message-broker 5672:5672 # forward port from working message broker
```
**Actually start app**
```
npm start api # and some other like "handler" could be run on prepared environment
```

### Running tests
```
npm run test
```
```
npm start api-e2e # and some other like "handler-e2e" could be run on prepared environment
```

### CI/CD
Full pipeline is [here](.github/workflows/ci-cd.yml)
1. Clone repository
2. Install NPM packages
3. Build source code & Docker images
4. Push docker images
5. Upgrade cluster with Helm
