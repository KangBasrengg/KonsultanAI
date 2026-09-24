declare module 'midtrans-client' {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string | undefined;
    clientKey: string | undefined;
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(options: SnapOptions);
    createTransaction(parameter: Record<string, any>): Promise<TransactionResult>;
    transaction: {
      status(orderId: string): Promise<Record<string, any>>;
    };
  }

  class CoreApi {
    constructor(options: SnapOptions);
    transaction: {
      status(orderId: string): Promise<Record<string, any>>;
    };
  }

  export default { Snap, CoreApi };
}

interface Window {
  snap: any;
}
