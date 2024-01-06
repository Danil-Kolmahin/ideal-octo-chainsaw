#!/bin/sh

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade -i prometheus prometheus-community/kube-prometheus-stack --version 39.13.3 --values scripts/monitoring/kube-prometheus-stack-values.yaml
# kubectl --namespace default get pods -l "release=prometheus"
# kubectl edit service/prometheus-grafana # chnge "NodePort"
kubectl port-forward service/prometheus-grafana 3000:80

# https://www.davidprat.com/install-k3s-prometheus-and-grafana-in-5-minutes/
