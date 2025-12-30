

Here you go — your **minimal User model** represented as a clean Markdown table.

---

# 🧩 User Model (Markdown Table)

| Property        | Type       | Description |
|-----------------|------------|-------------|
| `Id`            | `Guid`     | Internal primary key for your backend user. |
| `AuthProviderId` | `string`  | The unique external user ID from Auth0 or other providers (the `sub` claim). |
| `Provider`      | `string`   | Identity provider name (e.g., `auth0`, `google-oauth2`, `github`). |
| `Email`         | `string?`  | Optional email returned by the provider. |
| `Name`          | `string?`  | Optional display name. |
| `CreatedAt`     | `DateTime` | Timestamp when the user was first created in your system. |
| `LastLoginAt`   | `DateTime` | Timestamp of the user's most recent login. |

---

If you want, I can also output this as a SQL table, EF Core entity configuration, or a DTO version.
