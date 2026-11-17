using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class Details
{
    public class Query : IRequest<CarDto?>
    {
        public Guid Id { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Query, CarDto?>
    {
        private readonly DataContext _context = context;

        public async Task<CarDto?> Handle(Query request, CancellationToken cancellationToken)
        {
            var car = await _context.Cars
                .Include(c => c.Photos)
                .Include(c => c.Features)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (car is null) return null;

            return CarMapper.ToDto(car);
        }
    }
}
