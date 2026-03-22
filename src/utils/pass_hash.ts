import * as argon2 from 'argon2'

export async function hashPassword(pass: string) {
  const hash = await argon2.hash(pass, {
    type: argon2.argon2id,
    timeCost: 4,
    memoryCost: 65536,
    parallelism: 1,
  })

  return { hash }
}

export async function verifyPassword(hash: string, pass: string) {
  return await argon2.verify(hash, pass)
}