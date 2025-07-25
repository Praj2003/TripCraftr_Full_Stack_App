-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "dateOfPurchase" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_email_key" ON "subscription"("email");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
