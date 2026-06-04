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

## Dépannage

Si K3S ne démarre pas correctement, consulter les logs :

```bash
journalctl -u k3s -e
```

Si le port 6443 est déjà utilisé, arrêter le service puis relancer le serveur à la main pour voir l'erreur directement :

```bash
sudo systemctl stop k3s && sudo k3s server
```
