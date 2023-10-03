# README for Simple Docker Network Explained


## Purpose

This repository aims to facilitate developers in setting up and using Helm and a local Docker registry without having to utilize DockerHub. The intent is to bypass DockerHub subscriptions which become a necessity when developers push multiple images, a common practice using Helm. Although using the `registry2` Docker image for pushing local images to our local repo isn’t the most secure method, it suffices for educational and developmental purposes, providing a seamless experience to follow along without additional costs.

## Quick Start

### Prerequisites

- Docker
- Docker Compose
- Helm
- Kubernetes Cluster (e.g., minikube)

### Step 1: Run the Docker Compose File

Start the local Docker registry.

```sh
docker-compose -f docker/registry/docker-compose.yaml up -d
```

Verify it’s running by navigating to [http://localhost:5000/v2/_catalog](http://localhost:5000/v2/_catalog).

### Step 2: Build and Push Images

Build and push your Docker images.

```sh
docker-compose build
docker-compose push
```

Validate the images are pushed by revisiting [http://localhost:5000/v2/_catalog](http://localhost:5000/v2/_catalog). The output should resemble:

```json
{
    "repositories": [
        "docker-web-api",
        "docker-web-app"
    ]
}
```

### Step 3: Deploy the Application using Helm

Navigate to the Helm chart and deploy the application.

```bash
cd k8s/local-app
kubectl create namespace local-app
helm install local-helm-release . --namespace local-app
```

Visit [http://localhost:30000](http://localhost:30000) and input `http://nx-express-api:3333/api` with the request option being 'Request In Container' to observe the expected output and see the response from the express deployment.

## Understanding the Workflow

### Docker Compose File Upgrade

The Docker Compose file is enhanced to include the local registry:

```yaml
version: "3"

services:
  # ... (Omitted for brevity)
  api:
    image: localhost:5000/docker-web-api:latest
  # ... (Omitted for brevity)
  web:
    image: localhost:5000/docker-web-app:latest
  # ... (Omitted for brevity)
```

### Helm Deployment Mechanics

- **API Deployment**: The `api-deployment.yaml` file in the Helm templates uses variable substitution from the `values.yaml` file.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.api.name }}
```

Where `values.yaml` includes:

```yaml
api:
  name: nx-express-api
  # ... (Additional configurations)
```

Hence, hostname → deployment name → value in `values.yaml`.

- **Service Configuration**: The `30000` port binding to our local machine originates from the `service.yaml` file and `values.yaml` (NodePort setting).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.web.name }}
spec:
  # ... (Omitted for brevity)
  ports:
    - protocol: TCP
      port: {{ .Values.web.port }}
      targetPort: {{ .Values.web.containerPort }}
      nodePort: {{ .Values.web.nodePort }}
  type: NodePort
```

## Conclusion

With this simplified, local method, developers can explore, develop, and experiment with Docker, Helm, and Kubernetes without the necessity of a DockerHub subscription. Always consider enhancing security and management for production-level applications and workflows.

---

**Note**: Ensure you explore the repository for detailed configurations and adapt according to your project requirements: [simple-docker-network-explained](https://github.com/josephaw1022/simple-docker-network-explained).