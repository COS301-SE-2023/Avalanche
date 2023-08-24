enum DataProductEnum {
    ZARCRegistrar = "ZARCRegistrar",
    AFRICARegistrar = "AFRICARegistrar",
    RyCERegistrar = "RYCERegistrar",
    DomainWatch = "DomainWatch"
}

export default interface IDataProduct {
    dataProductName: DataProductEnum
}