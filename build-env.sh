#!/bin/bash
ENV_FILE=".env"

if [ "$1" == "prod" ]; then
    cat > "$ENV_FILE" <<EOL

GENERATE_SOURCEMAP='false'
REACT_APP_CLIENT_ID='contractarFrontend'
REACT_APP_CLIENT_SECRET='contractar'

REACT_APP_CDN_URL="http://cdn.contratar.com.ar"

REACT_APP_BACKEND_URL='https://api.contratar.com.ar'
REACT_APP_ADMIN_BACKEND_URL='https://usuarios.contratar.com.ar'
REACT_APP_SITE_URL='https://contratar.com.ar'

CONTACT_MAIL="hola@contratar.com.ar"
REACT_APP_TERMS_AND_CONDITIONS_URL=\${REACT_APP_SITE_URL}/terms-and-conditions
REACT_APP_DATA_USAGE_URL=\${REACT_APP_SITE_URL}/data-usage
EOL

elif [ "$1" == "dev" ]; then
    cat > "$ENV_FILE" <<EOL
GENERATE_SOURCEMAP='false'
REACT_APP_CLIENT_ID='contractarFrontend'
REACT_APP_CLIENT_SECRET='contractar'

REACT_APP_CDN_URL="http://localhost:8000"

REACT_APP_BACKEND_URL='http://localhost:8090'
REACT_APP_ADMIN_BACKEND_URL='http://localhost:8002'
REACT_APP_SITE_URL='http://localhost:3000'

CONTACT_MAIL="hola@contratar.com.ar"
REACT_APP_TERMS_AND_CONDITIONS_URL=\${REACT_APP_SITE_URL}/terms-and-conditions
REACT_APP_DATA_USAGE_URL=\${REACT_APP_SITE_URL}/data-usage
EOL

else
    echo "Usage: $0 [prod|dev]"
    exit 1
fi

echo "Generated file: "

cat .env
