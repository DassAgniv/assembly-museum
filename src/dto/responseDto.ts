export interface ResponseDto {
    attendance: {
        month: string,
        year: number,
        highest: MuseumDto,
        lowest: MuseumDto,
        ignored?: MuseumDto,
        total: number
    }
}

export interface MuseumDto {
    museum: string,
    visitors: number
}