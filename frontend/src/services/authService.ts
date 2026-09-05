import { withMockLatency } from "./api";
import { demoUser } from "./mockData";
import type { User } from "@/types/insightflow";

let currentUser: User | null = null;

export async function login(email: string, _password: string): Promise<User> {
  currentUser = { ...demoUser, email: email.trim() || demoUser.email };
  return withMockLatency(currentUser, 420);
}

export async function register(name: string, email: string, _password: string): Promise<User> {
  const registeredUser = { ...demoUser, name: name.trim() || demoUser.name, email: email.trim() || demoUser.email, initials: (name.trim() || demoUser.name).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() };
  return withMockLatency(registeredUser, 420);
}

export async function logout(): Promise<void> {
  currentUser = null;
  await withMockLatency(undefined, 180);
}

export function getCurrentUser(): User | null {
  return currentUser;
}