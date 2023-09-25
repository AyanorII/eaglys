-- CreateTable
CREATE TABLE "Query" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "hashed" TEXT NOT NULL,
    "columns" JSONB NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);
