import { users, jobs, applications } from "@shared/schema";
import type {
  User,
  InsertUser,
  Job,
  InsertJob,
  Application,
  InsertApplication,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  getEmployerJobs(employerId: number): Promise<Job[]>;
  createJob(job: InsertJob & { employerId: number }): Promise<Job>;

  createApplication(application: InsertApplication & { seekerId: number }): Promise<Application>;
  getUserApplications(userId: number): Promise<Application[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private currentId: { users: number; jobs: number; applications: number };
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.currentId = { users: 1, jobs: 1, applications: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getEmployerJobs(employerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.employerId === employerId,
    );
  }

  async createJob(insertJob: InsertJob & { employerId: number }): Promise<Job> {
    const id = this.currentId.jobs++;
    const job: Job = { ...insertJob, id, createdAt: new Date() };
    this.jobs.set(id, job);
    return job;
  }

  async createApplication(
    insertApplication: InsertApplication & { seekerId: number },
  ): Promise<Application> {
    const id = this.currentId.applications++;
    const application: Application = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getUserApplications(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.seekerId === userId,
    );
  }
}

export const storage = new MemStorage();