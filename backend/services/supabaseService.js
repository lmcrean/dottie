import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

let supabase;

const isDevelopment = process.env.NODE_ENV !== "production";
// Check if we're in development mode without Supabase credentials
if (
  isDevelopment &&
  (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_PUBLIC)
) {
  // Create a mock Supabase client with the methods you need
  supabase = {
    from: (table) => {
      return {
        select: () => {
          // Return mock data based on the table
          const mockData = getMockDataForTable(table);
          return { data: mockData, error: null };
        },
        insert: (data) => {
          return { data, error: null };
        },
        update: (data) => {
          return { data, error: null };
        },
        delete: () => {
          return { data: null, error: null };
        },
        eq: () => {
          // Chain for more complex queries
          return this;
        },
        // Add other methods as needed
      };
    },
    auth: {
      signIn: () =>
        Promise.resolve({ user: { id: "mock-user-id" }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      // Add other auth methods as needed
    },
  };
} else {
  // Create the real Supabase client
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_PUBLIC
  );
}

// Helper function to return mock data based on the table
function getMockDataForTable(table) {
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

export default supabase;
