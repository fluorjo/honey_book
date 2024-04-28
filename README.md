https://honey-book.vercel.app/

- 로컬에서 npm run build->npm run start 실행 시 prisma/schema.prisma에서 datasource db 를 아래와 같이 수정해주세요. 
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
- 또한 env.production의 NEXT_PUBLIC_API_BASE_URL을 localhost:3000으로 바꿔주세요.

- 감사합니다