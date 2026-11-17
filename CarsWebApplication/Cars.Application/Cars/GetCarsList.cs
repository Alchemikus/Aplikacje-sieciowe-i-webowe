using Cars.Application.Cars.DTOs;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Cars.Application.Cars.Mappers;

namespace Cars.Application.Cars;

public class GetCarsList
{
    public class Query : IRequest<List<CarDto>>
    { }

    public class Handler(DataContext context) : IRequestHandler<Query, List<CarDto>>
    {
        private readonly DataContext _context = context;

        public async Task<List<CarDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _context.Cars.AsNoTracking().Select(car => CarMapper.ToDto(car)).ToListAsync(cancellationToken);
        }
    }
}
