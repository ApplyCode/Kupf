export interface ReturnSearchResultDto{
        tenentId: number;
        locationId: number;
        pfid?: any;
        empCidNum: string;
        employeeId: string;
        arabicName: string;
        englishName: string;
        empGender?: any;
        joinedDate: Date;
        mobileNumber: string;
        empMaritalStatus?: any;
        nationName?: any;
        contractType: string;
        next2KinName?: any;
        next2KinMobNumber?: any;
        subscriptionAmount: number;
        subscriptionPaid: number;
        lastSubscriptionPaid: number;
        subscriptionDueAmount: number;
        subscriptionStatus?: any;
        terminationDate?: any;
        endDate?: any;
        employeeStatus: string;
        isKUEmployee: boolean;
        isOnSickLeave: boolean;
        isMemberOfFund: boolean;
        countryId:number;
        countryNameEnglish:any;
        countryNameArabic:any;
        
}