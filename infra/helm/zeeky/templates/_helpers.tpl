{{/*
Expand the name of the chart.
*/}}
{{- define "zeeky.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "zeeky.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "zeeky.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "zeeky.labels" -}}
helm.sh/chart: {{ include "zeeky.chart" . }}
{{ include "zeeky.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "zeeky.selectorLabels" -}}
app.kubernetes.io/name: {{ include "zeeky.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "zeeky.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "zeeky.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the config map
*/}}
{{- define "zeeky.configMapName" -}}
{{- if .Values.configMap.create }}
{{- default (include "zeeky.fullname" .) .Values.configMap.name }}
{{- else }}
{{- default "default" .Values.configMap.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret
*/}}
{{- define "zeeky.secretName" -}}
{{- if .Values.secret.create }}
{{- default (include "zeeky.fullname" .) .Values.secret.name }}
{{- else }}
{{- default "default" .Values.secret.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the service
*/}}
{{- define "zeeky.serviceName" -}}
{{- default (include "zeeky.fullname" .) .Values.service.name }}
{{- end }}

{{/*
Create the name of the ingress
*/}}
{{- define "zeeky.ingressName" -}}
{{- default (include "zeeky.fullname" .) .Values.ingress.name }}
{{- end }}

{{/*
Create the image name
*/}}
{{- define "zeeky.image" -}}
{{- printf "%s/%s:%s" .Values.image.registry .Values.image.repository (.Values.image.tag | default .Chart.AppVersion) }}
{{- end }}

{{/*
Create the frontend image name
*/}}
{{- define "zeeky.frontendImage" -}}
{{- printf "%s/%s:%s" .Values.frontend.image.registry .Values.frontend.image.repository (.Values.frontend.image.tag | default .Chart.AppVersion) }}
{{- end }}

{{/*
Create the domain name
*/}}
{{- define "zeeky.domain" -}}
{{- .Values.domain | default "zeeky.local" }}
{{- end }}

{{/*
Create the API domain name
*/}}
{{- define "zeeky.apiDomain" -}}
{{- printf "api.%s" (include "zeeky.domain" .) }}
{{- end }}

{{/*
Create the frontend domain name
*/}}
{{- define "zeeky.frontendDomain" -}}
{{- .Values.frontend.ingress.hosts[0].host | default (include "zeeky.domain" .) }}
{{- end }}

{{/*
Create the namespace
*/}}
{{- define "zeeky.namespace" -}}
{{- .Release.Namespace }}
{{- end }}

{{/*
Create the release name
*/}}
{{- define "zeeky.releaseName" -}}
{{- .Release.Name }}
{{- end }}

{{/*
Create the release namespace
*/}}
{{- define "zeeky.releaseNamespace" -}}
{{- .Release.Namespace }}
{{- end }}

{{/*
Create the chart name
*/}}
{{- define "zeeky.chartName" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Create the chart version
*/}}
{{- define "zeeky.chartVersion" -}}
{{- .Chart.Version }}
{{- end }}

{{/*
Create the app version
*/}}
{{- define "zeeky.appVersion" -}}
{{- .Chart.AppVersion }}
{{- end }}

{{/*
Create the environment
*/}}
{{- define "zeeky.environment" -}}
{{- .Values.environment | default "production" }}
{{- end }}

{{/*
Create the image pull secrets
*/}}
{{- define "zeeky.imagePullSecrets" -}}
{{- if .Values.imagePullSecrets }}
imagePullSecrets:
{{- toYaml .Values.imagePullSecrets | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the node selector
*/}}
{{- define "zeeky.nodeSelector" -}}
{{- if .Values.nodeSelector }}
nodeSelector:
{{- toYaml .Values.nodeSelector | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the tolerations
*/}}
{{- define "zeeky.tolerations" -}}
{{- if .Values.tolerations }}
tolerations:
{{- toYaml .Values.tolerations | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the affinity
*/}}
{{- define "zeeky.affinity" -}}
{{- if .Values.affinity }}
affinity:
{{- toYaml .Values.affinity | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the resources
*/}}
{{- define "zeeky.resources" -}}
{{- if .Values.resources }}
resources:
{{- toYaml .Values.resources | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the security context
*/}}
{{- define "zeeky.securityContext" -}}
{{- if .Values.securityContext }}
securityContext:
{{- toYaml .Values.securityContext | nindent 2 }}
{{- end }}
{{- end }}

{{/*
Create the pod security context
*/}}
{{- define "zeeky.podSecurityContext" -}}
{{- if .Values.podSecurityContext }}
securityContext:
{{- toYaml .Values.podSecurityContext | nindent 2 }}
{{- end }}
{{- end }}