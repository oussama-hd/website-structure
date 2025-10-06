export interface Option {
    label: string;
    value: string;
    order: number;
    parent?: string;
  }
  
 export interface Field {
    step?: number;
    form?: string;
    code: string;
    label: string;
    defaultParam?: string; 
    obligatoire: boolean;
    order: number;
    type: string;
    authRendered?: boolean;
    disabled ?: boolean;
    size?: string;
    options?: Option[];
    depend?: string;
  }
  
 export interface FormResponse {
    data: Field[];
    msg: string;
    status: string;
    timestamp: string;
  }
  
  export interface Step {
    id: number;
    label: string;
    type: 'form' | 'api';
    url?: string;
  }
  
  interface ApiResponse {
    data: Step[];
    msg: string;
    status: 'SUCCESS' | 'FAILURE' | string;
    timestamp: string;
  }
  


  export interface Garantie {
    code: string;
    label: string;
    order: number;
    ptsLimiteType?: string;
    ptsLimiteValeur?: number;
  }
  
  export interface Formule {
    code: string;
    label: string;
    detailGaranties: Garantie[];
  }
  
  export interface FormuleData {
    id: number;
    formule: Formule;
    price: string;
  }
  
  export interface ApiResponss {
    data: FormuleData[];
    msg: string;
    status: string;
    timestamp: string;
  }
  