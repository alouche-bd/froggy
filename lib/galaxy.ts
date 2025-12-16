import type { Order, Patient, User } from "@prisma/client";

const GALAXY_BASE_URL =
    process.env.GALAXY_BASE_URL ?? "https://api-galaxy.biotech-dental.com";

const GALAXY_APP_NAME = "E-DENTAL";
const GALAXY_APP_VERSION = "v.20.7.8";
const GALAXY_BUSINESS_UNIT = "FROGGYMOUTH";
const GALAXY_ENTITY = "SMILERS";
const GALAXY_USER_DESIGNATION = "AL";

const FROGGY_REFERENCES: Record<
    string,
    { designation: string; reference: string }
> = {
    small: {
        designation: "Froggymouth® - S - LOT1800264-FM-V3-20-25",
        reference: "Froggymouth® - S - LOT1800264-FM-V3-20-25",
    },
    medium: {
        designation: "Froggymouth® - M - LOT-v2-16-24",
        reference: "Froggymouth® - M - LOT-v2-16-24",
    },
    large: {
        designation: "Froggymouth® - L - LOTfmv1-16-24",
        reference: "Froggymouth® - L - LOTfmv1-16-24",
    },
};

function getGalaxyHeaders() {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (process.env.GALAXY_BEARER_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GALAXY_BEARER_TOKEN}`;
    }

    return headers;
}

export async function sendGalaxyDeliveryAddress(opts: {
    order: Order & { patient: Patient; user: User };
}) {
    const { order } = opts;

    const deliveryMode = (order as any).deliveryMode as
        | "ADDRESS"
        | "PRACTITIONER"
        | undefined;

    const isToCabinet = deliveryMode === "PRACTITIONER";

    const address = isToCabinet
        ? order.user.professionalAddress
        : (order.patient as any).street;

    const city = isToCabinet
        ? order.user.city
        : (order.patient as any).city;

    const zipCode = isToCabinet
        ? order.user.postalCode
        : (order.patient as any).zip;

    const country =
        (order.patient as any).country || "France";

    const clientSocialReason = isToCabinet
        ? `${order.user.firstName} ${order.user.lastName}`.trim()
        : order.patient.name;

    const payload = {
        action: "create_address",
        appName: GALAXY_APP_NAME,
        appVersion: GALAXY_APP_VERSION,
        businessUnit: GALAXY_BUSINESS_UNIT,
        entity: GALAXY_ENTITY,
        transactionUuid: order.id,
        userDesignation: GALAXY_USER_DESIGNATION,
        addressData: {
            address,
            address2: null,
            address3: null,
            carrierCode: "1",
            city,
            clientCode: "WEBFR",
            clientSocialReason,
            country,
            countryCode: "FR",
            email: order.patient.email,
            entitled_x3: clientSocialReason,
            fax: null,
            id: "-",
            phone: order.patient.phone ?? "",
            principal: false,
            siteSource: "CRAP",
            zipCode,
            zone: "FR",
        },
    };

    const res = await fetch(
        `${GALAXY_BASE_URL}/send-delivery-address-in-queue`,
        {
            method: "POST",
            headers: getGalaxyHeaders(),
            body: JSON.stringify(payload),
        }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
            "Galaxy send-delivery-address-in-queue failed:",
            res.status,
            text
        );
    }
}

export async function sendGalaxyOrder(opts: {
    order: Order & { patient: Patient; user: User };
}) {
    const { order } = opts;

    const sizeKey = ((order as any).size || "medium").toLowerCase();
    const product = FROGGY_REFERENCES[sizeKey] ?? FROGGY_REFERENCES.medium;
    const expeditionDate = new Date().toISOString().slice(0, 10);
    const totalTTC = order.amountCents / 100;
    const shippingFee = 6.5;
    const unitPrice = totalTTC - shippingFee;

    const payload = {
        appName: GALAXY_APP_NAME,
        appVersion: GALAXY_APP_VERSION,
        businessUnit: GALAXY_BUSINESS_UNIT,
        entity: GALAXY_ENTITY,
        isProCustomer: false,
        orderHeaderData: {
            carrierCode: "COLISSIMO",
            clientCode: "WEBFR",
            clientDeliveryAddressCode: "-",
            clientIdsf: null,
            clientSocialReason: order.patient.name,
            currency: "EUR",
            discountAmount: 0,
            doNotShip: false,
            expeditionDate,
            fromOffer: false,
            fromQuote: false,
            importws: true,
            initialAndOriginComment: "AL Prescription",
            initials: "AL",
            invoiceAuto: false,
            originComment: "Prescription",
            prepaid: true,
            saturdayDelivery: false,
            serviceCode: "undefined",
            shippingFee,
            siteSource: "CRAP",
            smileyAmount: 0,
            totalTTC,
            typeOrder: "SON",
            wsuid: `SON-W-${order.id}`,
        },
        orderLinesData: {
            line: [
                {
                    batch: null,
                    comment: null,
                    designation: product.designation,
                    discount: 0,
                    originDiscount: null,
                    priceType: "TTC",
                    quantity: 1,
                    reference: product.reference,
                    selectedCounter: {
                        code: "Commande",
                        coefficient: null,
                        developerName: null,
                        id: null,
                        label: null,
                        motif: null,
                        remainingValue: null,
                    },
                    taxRate: null,
                    unitPrice,
                    unitSale: "UN",
                },
            ],
        },
        transactionUuid: order.id,
        userDesignation: GALAXY_USER_DESIGNATION,
    };

    const res = await fetch(
        `${GALAXY_BASE_URL}/send-order-in-queue`,
        {
            method: "POST",
            headers: getGalaxyHeaders(),
            body: JSON.stringify(payload),
        }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(
            "Galaxy send-order-in-queue failed:",
            res.status,
            text
        );
    }
}
