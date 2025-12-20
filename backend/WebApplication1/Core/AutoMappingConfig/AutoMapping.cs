using AutoMapper;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;

namespace WebApplication1.Core.AutoMappingConfig
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<Basket, BasketDto>();
            CreateMap<BasketItem, BasketItemDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.Product.PictureUrl))
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Product.Brand))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Product.Type));

        }
    }
}