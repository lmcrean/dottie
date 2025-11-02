import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  data: any;
  error: any;
}

interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder;
  auth: {
    signIn: () => Promise<{ user: { id: string }; error: null }>;
    signOut: () => Promise<{ error: null }>;
  };
}

let supabase: SupabaseClient | MockSupabaseClient;

const isDevelopment = process.env.NODE_ENV !== "production";
// Check if we're in development mode without Supabase credentials
if (
  isDevelopment &&
  (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_PUBLIC)
) {
  // Create a mock Supabase client with the methods you need
  supabase = {
    from: (table: string): MockQueryBuilder => {
      return {
        select: function(columns?: string): MockQueryBuilder {
          // Return mock data based on the table
          const mockData = getMockDataForTable(table);
          this.data = mockData;
          this.error = null;
          return this;
        },
        insert: function(data: any): MockQueryBuilder {
          this.data = data;
          this.error = null;
          return this;
        },
        update: function(data: any): MockQueryBuilder {
          this.data = data;
          this.error = null;
          return this;
        },
        delete: function(): MockQueryBuilder {
          this.data = null;
          this.error = null;
          return this;
        },
        eq: function(column: string, value: any): MockQueryBuilder {
          // Chain for more complex queries
          return this;
        },
        data: null,
        error: null
        // Add other methods as needed
      };
    },
    auth: {
      signIn: (): Promise<{ user: { id: string }; error: null }> =>
        Promise.resolve({ user: { id: "mock-user-id" }, error: null }),
      signOut: (): Promise<{ error: null }> => Promise.resolve({ error: null }),
      // Add other auth methods as needed
    },
  };
} else {
  // Create the real Supabase client
  supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_PUBLIC!
  );
}

// Helper function to return mock data based on the table
function getMockDataForTable(table: string): any[] {
  switch (table) {
    case "users":
      return [
        { id: 1, name: "Mock User 1", email: "user1@example.com" },
        { id: 2, name: "Mock User 2", email: "user2@example.com" },
      ];
    case "products":
      return [
        { id: 1, name: "Mock Product 1", price: 29.99 },
        { id: 2, name: "Mock Product 2", price: 49.99 },
      ];
    // Add cases for other tables
    default:
      return [];
  }
}

export default supabase as SupabaseClient;
