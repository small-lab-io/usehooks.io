export interface HookMeta {
  name: string;
  title: string;
  description: string;
  category: string;
  examples: Array<{ name: string; description: string }>;
}

export interface HookDocParameter {
  name: string;
  type: string;
  optional?: boolean;
  default?: string;
  description: string;
  properties?: Array<{
    name: string;
    type: string;
    optional?: boolean;
    description: string;
  }>;
}

export interface HookDocReturnType {
  type: string;
  properties: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

export interface HookDocMethod {
  name: string;
  type: string;
  description: string;
  category: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    optional?: boolean;
    default?: string;
  }>;
  returns?: string;
}

export interface HookDocExample {
  name: string;
  description: string;
  code: string;
}

export interface HookDoc {
  name: string;
  description: string;
  category: string;
  parameters: Array<HookDocParameter>;
  returnType?: HookDocReturnType;
  methods?: Array<HookDocMethod>;
  examples: Array<HookDocExample>;
  dependencies?: string[];
  notes?: string[];
}