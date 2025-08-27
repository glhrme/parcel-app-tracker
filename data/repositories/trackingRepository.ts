import { supabase as Supabase } from "@/utils/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { TrackingService } from "../services/trackingService";

export class TrackingRepository {

  private trackingService: TrackingService;
  private supabase: SupabaseClient

  constructor() {
    this.trackingService = new TrackingService();
    this.supabase = Supabase
  }

}