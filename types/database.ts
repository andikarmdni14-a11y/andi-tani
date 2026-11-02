// Tipe manual sesuai supabase/migrations/001_fase1_schema.sql.
// Setelah project Supabase aktif, sebaiknya diganti hasil generate:
// npx supabase gen types typescript --project-id <id> > types/database.ts

export type PlantStatus = "Siap Jual" | "Karantina" | "Pembibitan" | "Produk Umum";
export type OrderStatus = "pending" | "completed" | "cancelled";
export type UserRole = "admin" | "customer";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone_number: string | null;
          role: UserRole;
          province: string | null;
          city: string | null;
          district: string | null;
          postal_code: string | null;
          address_detail: string | null;
          created_at: string;
        };
        Insert: never;
        Update: {
          full_name?: string | null;
          phone_number?: string | null;
          role?: UserRole;
          province?: string | null;
          city?: string | null;
          district?: string | null;
          postal_code?: string | null;
          address_detail?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      care_guides: {
        Row: {
          id: string;
          name: string;
          light_requirement: string | null;
          watering_frequency: string | null;
          fertilizer_type: string | null;
          difficulty_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          light_requirement?: string | null;
          watering_frequency?: string | null;
          fertilizer_type?: string | null;
          difficulty_level?: string | null;
        };
        Update: {
          name?: string;
          light_requirement?: string | null;
          watering_frequency?: string | null;
          fertilizer_type?: string | null;
          difficulty_level?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          stock: number;
          plant_status: PlantStatus;
          is_active: boolean;
          category_id: string;
          care_guide_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          stock?: number;
          plant_status?: PlantStatus;
          is_active?: boolean;
          category_id: string;
          care_guide_id?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          stock?: number;
          plant_status?: PlantStatus;
          is_active?: boolean;
          category_id?: string;
          care_guide_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_care_guide_id_fkey";
            columns: ["care_guide_id"];
            isOneToOne: false;
            referencedRelation: "care_guides";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          user_id: string;
          customer_name: string;
          customer_phone: string;
          shipping_province: string;
          shipping_city: string;
          shipping_district: string;
          shipping_postal_code: string;
          shipping_address_detail: string;
          total_amount: number;
          shipping_cost: number;
          status: OrderStatus;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_time: number;
        };
        Insert: never;
        Update: never;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      create_order: {
        Args: { p_items: { product_id: string; quantity: number }[] };
        Returns: CreateOrderResult;
      };
      confirm_order: {
        Args: { p_order_code: string; p_shipping_cost?: number };
        Returns: { order_code: string; status: "completed"; shipping_cost: number };
      };
      cancel_order: {
        Args: { p_order_code: string };
        Returns: { order_code: string; status: "cancelled"; stock_restored: boolean };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type CreateOrderResult = {
  order_id: string;
  order_code: string;
  total_amount: number;
  items: { name: string; quantity: number; price: number }[];
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CareGuide = Database["public"]["Tables"]["care_guides"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
