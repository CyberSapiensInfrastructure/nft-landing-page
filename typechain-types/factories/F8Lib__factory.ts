/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { F8Lib, F8LibInterface } from "../F8Lib";

const _abi = [
  {
    inputs: [],
    name: "noChange",
    type: "error",
  },
];

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212208e9ec185027e468c3d32571b7bb441882182b65be6dfb048c248823f44359bc364736f6c634300081a0033";

type F8LibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: F8LibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class F8Lib__factory extends ContractFactory {
  constructor(...args: F8LibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "F8Lib";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<F8Lib> {
    return super.deploy(overrides || {}) as Promise<F8Lib>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): F8Lib {
    return super.attach(address) as F8Lib;
  }
  connect(signer: Signer): F8Lib__factory {
    return super.connect(signer) as F8Lib__factory;
  }
  static readonly contractName: "F8Lib";
  public readonly contractName: "F8Lib";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): F8LibInterface {
    return new utils.Interface(_abi) as F8LibInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): F8Lib {
    return new Contract(address, _abi, signerOrProvider) as F8Lib;
  }
}
