![Build](https://github.com/stewie1520/worklog/actions/workflows/build.yml/badge.svg)

## 📦 Install dependencies

```
pnpm install
pnpm run dev
```

```
open http://localhost:3000
```

## 🗄️ Vault configuration

```sh
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=s....

vault write auth/approle/role/worklog-role \
     token_ttl=1h \
     token_max_ttl=2h \
     token_policies=readonly-kv-worklog-role

# Get the role id and secret
vault read auth/approle/worklog-role/role-id
vault write -f auth/approle/role/worklog-role/secret-id
```

```sh
vault kv put "kv/data/pg/webapp" db_name="worklog" db_username="user" db_password="password" db_host="localhost" db_port="5432"
```

```sh
vault kv put "kv/data/common/webapp" jwt_secret="supers3cr3t"
```

## 💾 Sequelize migration

```sh
npx sequelize-cli migration:generate --name add-table-user
```

```sh
npx sequelize-cli db:migrate --url 'postgres://user:password@localhost:5432/worklog'
```

```sh
npx sequelize-cli db:migrate:undo --url 'postgres://user:password@localhost:5432/worklog'
```