-- One account can buy and sell. Give every seller the buyer role too. Safe to run twice.
UPDATE "user"
SET "role" = array_append("role", 'buyer'::"role")
WHERE 'seller'::"role" = ANY("role") AND NOT ('buyer'::"role" = ANY("role"));
