# Déploiement

## Prérequis

- Une machine avec K3S installé
- `kubectl` configuré sur le cluster
- Une image Docker accessible sur DockerHub
- Une base PostgreSQL accessible avec les variables `DB_*`

## Installation de K3S

Cette commande se lance sur une machine Linux ou dans un environnement compatible, pas directement dans un terminal Windows standard.

```bash
curl -sfL https://get.k3s.io | sh -
```

Vérifier ensuite l'état du cluster :

```bash
kubectl get nodes
```

Le nœud doit apparaître en état `Ready`.

## Déploiement de l'application

Appliquer les manifests Kubernetes depuis la racine du projet :

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Variables d'environnement attendues par le code :

```bash
DB_HOST=database
DB_PORT=5432
DB_NAME=testdb
DB_USER=postgres
DB_PASSWORD=secret
```

## Vérification

```bash
kubectl get pods
kubectl get svc
```

## Déploiement K3S phase 4

Pour le déploiement automatisé sur la branche `main`, la pipeline attend deux secrets :

```bash
KUBE_CONFIG
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

La phase 4 se valide manuellement avec ces commandes :

```bash
docker build -t projet-docker-api:latest .
kubectl apply -f k8s/
kubectl get pods -w
kubectl get svc todo-api
kubectl rollout status deployment/todo-api
kubectl port-forward svc/todo-api 8080:80
curl http://localhost:8080/health
```

Pour le rolling update et la résilience :

```bash
kubectl set image deployment/todo-api todo-api=<dockerhub-user>/todo-api:<commit-sha>
kubectl rollout status deployment/todo-api
kubectl get pods
kubectl delete pod <pod-name>
kubectl get pods
kubectl describe pod <pod-name>
```

## Dépannage

Si K3S ne démarre pas correctement, consulter les logs :

```bash
journalctl -u k3s -e
```

Si le port 6443 est déjà utilisé, arrêter le service puis relancer le serveur à la main pour voir l'erreur directement :

```bash
sudo systemctl stop k3s && sudo k3s server
```
