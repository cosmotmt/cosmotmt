# テーブル定義

コードの簡潔さを重視し、以下の省略形を使用しています。

- `gworks` = Game Works (ゲーム制作実績)
- `mworks` = Music Works (音楽制作実績)
- `techs` = Technologies (技術スタック・タグ)
- `roles` = Roles (担当役割・タグ)
- `genres` = Genres (音楽ジャンル・タグ)

```mermaid
erDiagram
    admins {
        integer id PK
        text email UK
        text password
        text salt
        datetime created_at
    }

    sessions {
        text id PK
        integer admin_id FK
        datetime expires_at
        datetime created_at
    }

    gworks {
        integer id PK
        text title
        text description
        text platform
        text features
        text development_type
        text thumbnail_url
        text external_url
        date start_date
        date end_date
        datetime created_at
    }

    mworks {
        integer id PK
        text title
        text description
        text development_type
        text audio_url
        text thumbnail_url
        text external_url
        date start_date
        date end_date
        datetime created_at
    }

    techs {
        integer id PK
        text name UK
    }

    roles {
        integer id PK
        text name UK
    }

    genres {
        integer id PK
        text name UK
    }

    gwork_techs {
        integer gwork_id PK, FK
        integer tech_id PK, FK
    }

    gwork_roles {
        integer gwork_id PK, FK
        integer role_id PK, FK
    }

    mwork_genres {
        integer mwork_id PK, FK
        integer genre_id PK, FK
    }

    mwork_roles {
        integer mwork_id PK, FK
        integer role_id PK, FK
    }

    contacts {
        integer id PK
        text name "NOT NULL"
        text email "NOT NULL"
        text message "NOT NULL"
        datetime created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    admins ||--o{ sessions: "has"
    gworks ||--o{ gwork_techs: "uses"
    techs ||--o{ gwork_techs: "used by"
    gworks ||--o{ gwork_roles: "assigned"
    roles ||--o{ gwork_roles: "assigned to"
    mworks ||--o{ mwork_genres: "categorized"
    genres ||--o{ mwork_genres: "categorized by"
    mworks ||--o{ mwork_roles: "assigned"
    roles ||--o{ mwork_roles: "assigned to"
```
