export type { ServerUser } from "../types/user.types";
import { endpoints } from "@/services/endpoints";
import { request } from "@/services/http";

import type { ServerUser } from "../types/user.types";


export async function getUsers(): Promise<ServerUser[]> {
  return request<ServerUser[]>(endpoints.users);
}

export async function getUserWithRoles(): Promise<ServerUser[]> {
  return request<ServerUser[]>(endpoints.userWithRoles);
}

export async function getUserById(id: string | number): Promise<ServerUser> {
  return request<ServerUser>(endpoints.userById(id));
}

export async function getUsersByEmail(email: string): Promise<ServerUser[]> {
  return request<ServerUser[]>(endpoints.usersByEmail(email));
}

export async function createUser(user: Record<string, unknown>): Promise<ServerUser> {
  return request<ServerUser>(endpoints.users, {
    method: "POST",
    data: user,
  });
}

export async function updateUser(id: string | number, updates: Record<string, unknown>): Promise<ServerUser> {
  return request<ServerUser>(endpoints.userById(id), {
    method: "PATCH",
    data: updates,
  });
}

export async function replaceUser(id: string | number, user: Record<string, unknown>): Promise<ServerUser> {
  return request<ServerUser>(endpoints.userById(id), {
    method: "PUT",
    data: user,
  });
}

export async function deleteUser(id: string | number): Promise<void> {
  await request<void>(endpoints.userById(id), {
    method: "DELETE",
  });
}

/** Alias usado por código existente. */
