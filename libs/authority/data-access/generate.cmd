@echo off
curl http://localhost:5000/v1/openapi.json -O openapi.json
rmdir /S /Q src
mkdir src
docker run --rm -v "%CD%":/local swaggerapi/swagger-codegen-cli-v3:3.0.27 generate -i /local/openapi.json -l typescript-angular -o /local/src --additional-properties ngVersion=16.2.0

git checkout HEAD -- src\api.module.ts
git checkout HEAD -- src\model\modelObject.ts
git checkout HEAD -- src\model\problemDetails.ts
git checkout HEAD -- src\model\validationProblemDetails.ts
git checkout HEAD -- src\encoder.ts


