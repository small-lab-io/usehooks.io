'use client';

import { useState, useCallback } from "react";

type ContactProperty = "name" | "email" | "tel" | "address" | "icon";

interface ContactAddress {
  country?: string;
  addressLine?: string[];
  region?: string;
  city?: string;
  dependentLocality?: string;
  postalCode?: string;
  sortingCode?: string;
}

interface Contact {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: ContactAddress[];
  icon?: Blob[];
}

interface UseContactPickerOptions {
  multiple?: boolean;
}

interface UseContactPickerReturn {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  availableProperties: ContactProperty[];
  selectContacts: (
    properties: ContactProperty[],
    options?: UseContactPickerOptions
  ) => Promise<Contact[]>;
  getAvailableProperties: () => Promise<ContactProperty[]>;
  clearContacts: () => void;
}

// Extend Navigator interface for TypeScript
declare global {
  interface Navigator {
    contacts?: {
      select: (
        properties: ContactProperty[],
        options?: { multiple?: boolean }
      ) => Promise<Contact[]>;
      getProperties: () => Promise<ContactProperty[]>;
    };
  }
}

export const useContactPicker = (): UseContactPickerReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableProperties, setAvailableProperties] = useState<
    ContactProperty[]
  >([]);

  // Check if Contact Picker API is supported
  const isSupported =
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    typeof navigator.contacts?.select === "function";

  // Get available contact properties
  const getAvailableProperties = useCallback(async (): Promise<
    ContactProperty[]
  > => {
    if (!isSupported || !navigator.contacts?.getProperties) {
      setError("Contact Picker API is not supported");
      return [];
    }

    try {
      setError(null);
      const properties = await navigator.contacts.getProperties();
      setAvailableProperties(properties);
      return properties;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get available properties";
      setError(errorMessage);
      return [];
    }
  }, [isSupported]);

  // Select contacts with specified properties
  const selectContacts = useCallback(
    async (
      properties: ContactProperty[],
      options: UseContactPickerOptions = {}
    ): Promise<Contact[]> => {
      if (!isSupported || !navigator.contacts?.select) {
        setError("Contact Picker API is not supported");
        return [];
      }

      if (properties.length === 0) {
        setError("At least one contact property must be specified");
        return [];
      }

      try {
        setIsLoading(true);
        setError(null);

        const selectedContacts = await navigator.contacts.select(properties, {
          multiple: options.multiple || false,
        });

        setContacts(selectedContacts);
        return selectedContacts;
      } catch (err) {
        let errorMessage = "Failed to select contacts";

        if (err instanceof Error) {
          // Handle specific error cases
          if (err.name === "InvalidStateError") {
            errorMessage = "Contact picker is already open";
          } else if (err.name === "SecurityError") {
            errorMessage =
              "Contact picker requires user gesture and secure context";
          } else if (err.name === "NotSupportedError") {
            errorMessage = "One or more requested properties are not supported";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported]
  );

  // Clear selected contacts
  const clearContacts = useCallback(() => {
    setContacts([]);
    setError(null);
  }, []);

  return {
    contacts,
    isLoading,
    error,
    isSupported,
    availableProperties,
    selectContacts,
    getAvailableProperties,
    clearContacts,
  };
};
