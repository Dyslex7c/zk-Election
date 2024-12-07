declare module 'snarkjs' {
    namespace groth16 {
      function fullProve(
        input: Record<string, any>,
        wasmFile: string,
        zkeyFile: string
      ): Promise<{
        proof: {
          pi_a: [string, string];
          pi_b: [[string, string], [string, string]];
          pi_c: [string, string];
        };
        publicSignals: string[];
      }>;
    }
  
    export { groth16 };
  }
  