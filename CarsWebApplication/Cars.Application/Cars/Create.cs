using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public class Create
{
    public class Command : IRequest<CarDto>
    {
        public required CarDto CarDto { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, CarDto>
    {
        private readonly DataContext _context = context;

        public async Task<CarDto> Handle(Command request, CancellationToken cancellationToken)
        {
            var car = CarMapper.ToEntity(request.CarDto);

            _context.Cars.Add(car);
            await _context.SaveChangesAsync(cancellationToken);

            return CarMapper.ToDto(car);
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.CarDto).SetValidator(new CarDtoValidator());
        }
    }
}
