"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Shield,
  Mail,
  Lock,
  Bell,
  Globe,
  DollarSign,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

// Rest of the file content remains the same as app/admin/settings/page.tsx