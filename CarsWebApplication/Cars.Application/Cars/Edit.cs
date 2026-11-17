using Cars.Application.Cars.DTOs;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public class Edit
{
    public class Command : IRequest<bool>
    {
        public Guid Id { get; set; }
        public required CarDto CarDto { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, bool>
    {
        private readonly DataContext _context = context;

        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var car = await _context.Cars.FindAsync([request.Id], cancellationToken);

            if (car is null) return false;

            car.Brand = request.CarDto.Brand;
            car.Model = request.CarDto.Model;
            car.DoorsNumber = request.CarDto.DoorsNumber;
            car.LuggageCapacity = request.CarDto.LuggageCapacity;
            car.EngineCapacity = request.CarDto.EngineCapacity;
            car.FuelType = request.CarDto.FuelType;
            car.ProductionDate = request.CarDto.ProductionDate;
            car.AverageFuelConsumption = request.CarDto.AverageFuelConsumption;
            car.BodyType = request.CarDto.BodyType;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
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
