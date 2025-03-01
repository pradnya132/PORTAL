import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertJobSchema, insertApplicationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Jobs
  app.get("/api/jobs", async (req, res) => {
    const jobs = await storage.getAllJobs();
    res.json(jobs);
  });

  app.get("/api/jobs/posted", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "employer") {
      return res.sendStatus(403);
    }
    const jobs = await storage.getEmployerJobs(req.user.id);
    res.json(jobs);
  });

  app.get("/api/jobs/:id", async (req, res) => {
    const job = await storage.getJob(parseInt(req.params.id));
    if (!job) return res.sendStatus(404);
    res.json(job);
  });

  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "employer") {
      return res.sendStatus(403);
    }

    const parsed = insertJobSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const job = await storage.createJob({
      ...parsed.data,
      employerId: req.user.id,
    });
    res.status(201).json(job);
  });

  // Applications
  app.post("/api/jobs/:id/apply", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "seeker") {
      return res.sendStatus(403);
    }

    const parsed = insertApplicationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const application = await storage.createApplication({
      ...parsed.data,
      jobId: parseInt(req.params.id),
      seekerId: req.user.id,
    });
    res.status(201).json(application);
  });

  app.get("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const applications = await storage.getUserApplications(req.user.id);
    const jobs = await Promise.all(
      applications.map(async (app) => {
        const job = await storage.getJob(app.jobId);
        return { ...app, job };
      })
    );
    res.json(jobs);
  });

  const httpServer = createServer(app);
  return httpServer;
}