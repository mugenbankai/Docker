# Tableau de bord des métriques

## Source des métriques

- Endpoint application: `/metrics`
- Collecteur: Prometheus
- Visualisation: Grafana

## Tableau récapitulatif

| Métrique                                    | Valeur mesurée | Commande / source                                                                                |
| ------------------------------------------- | -------------: | ------------------------------------------------------------------------------------------------ |
| Durée totale de la pipeline (lint → deploy) |      À relever | GitHub Actions run duration                                                                      |
| Taille de l'image Docker avant optimisation |      À relever | `docker images projet-docker-api --format "{{.Size}}"`                                           |
| Taille de l'image Docker après optimisation |      À relever | `docker images projet-docker-api --format "{{.Size}}"`                                           |
| Temps du rolling update                     |      À relever | `kubectl rollout status deployment/todo-api`                                                     |
| Nombre de pods en charge                    |      À relever | `kubectl get pods -l app=todo-api`                                                               |
| Latence p95 de l'API                        |      À relever | Grafana: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |

## Requêtes Grafana utiles

- Trafic total: `sum(rate(http_requests_total[1m]))`
- Erreurs 5xx: `sum(rate(http_requests_total{status_code=~"5.."}[1m]))`
- p95: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`

## Preuves à capturer

- Dashboard Grafana montrant `http_requests_total` qui augmente quand tu fais des requêtes.
- Dashboard Grafana montrant la hausse du taux d'erreurs quand tu appelles une route inexistante en boucle.
- Dashboard Grafana montrant l'impact sur la latence et les erreurs quand tu supprimes un pod pendant que l'app sert du trafic.
