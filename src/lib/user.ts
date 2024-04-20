import { sql } from '@vercel/postgres';

export const getUser = async (id: number) => {
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
  return rows.length ? rows[0] : null;
};

export const createUser = async (id: number, userData: any, data: any = {}) => {
  const { rows } = await sql`
    INSERT INTO users (id, userData, data)
    VALUES (${id}, ${JSON.stringify(userData)}, ${JSON.stringify(data)});
  `;
  return rows.length ? rows[0] : null;
};

export const updateUser = async (id: number, data: any) => {
  const user = await getUser(id);
  if (!user) {
    return null;
  }
  const newData = { ...user.data, ...data };
  const { rows } = await sql`
    UPDATE users
    SET data = ${JSON.stringify(newData)}
    WHERE id = ${id};
  `;
  return rows.length ? rows[0] : null;
};
